<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Entity\Task;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', array(
            'base_dir' => realpath($this->container->getParameter('kernel.root_dir').'/..'),
        ));
    }
	
	public function ajaxViewAllAction(Request $request) {
		
        if (!$request->isXmlHttpRequest()) {
            throw new NotFoundHttpException();
        }
		
		$response = $response = array('status' => 'success', 'count' => 0);
		$er = $this->getDoctrine()->getManager()->getRepository('AppBundle:Task')
				   ->createQueryBuilder('t')
				   ->where('t.deleted = :deleted')
				   ->setParameter('deleted', false)
				   ->andWhere('t.clientIp = :clientIp')
				   ->setParameter('clientIp', $_SERVER['REMOTE_ADDR'])
				   ->addOrderBy('t.dateCreated', 'ASC');
					
		$tasks = $er->getQuery()->getResult();
		if($tasks) {
			$response = array('status' => 'success');		
			foreach($tasks as $task) {
				$response[] = array('id' => $task->getId(), 'title' => $task->getTitle(), 'note' => $task->getNote(), 'completed' => $task->getCompleted(), 'deleted' => $task->getDeleted());
			}
			$response['count'] = count($tasks);
			return new JsonResponse($response, 200);
		}
		return new JsonResponse($response, 200);
	}

	public function ajaxViewCompleteAction(Request $request) {
		
        if (!$request->isXmlHttpRequest()) {
            throw new NotFoundHttpException();
        }
		
		$response = $response = array('status' => 'success', 'count' => 0);
		$er = $this->getDoctrine()->getManager()->getRepository('AppBundle:Task')
				   ->createQueryBuilder('t')
				   ->where('t.completed = :completed')
				   ->setParameter('completed', true)
				   ->andWhere('t.deleted = :deleted')
				   ->setParameter('deleted', false)
				   ->andWhere('t.clientIp = :clientIp')
				   ->setParameter('clientIp', $_SERVER['REMOTE_ADDR'])
				   ->addOrderBy('t.dateCreated', 'ASC');
					
		$tasks = $er->getQuery()->getResult();
		if($tasks) {
			foreach($tasks as $task) {
				$response[] = array('id' => $task->getId(), 'title' => $task->getTitle(), 'note' => $task->getNote(), 'completed' => $task->getCompleted(), 'deleted' => $task->getDeleted());
			}
			$response['count'] = count($tasks);
		}
		return new JsonResponse($response, 200);
	}

	public function ajaxViewActiveAction(Request $request) {
		
        if (!$request->isXmlHttpRequest()) {
            throw new NotFoundHttpException();
        }
		
		$response = $response = array('status' => 'success', 'count' => 0);
		$er = $this->getDoctrine()->getManager()->getRepository('AppBundle:Task')
				   ->createQueryBuilder('t')
				   ->where('t.completed = :completed')
				   ->setParameter('completed', false)
				   ->andWhere('t.deleted = :deleted')
				   ->setParameter('deleted', false)
				   ->andWhere('t.clientIp = :clientIp')
				   ->setParameter('clientIp', $_SERVER['REMOTE_ADDR'])
				   ->addOrderBy('t.dateCreated', 'ASC');
					
		$tasks = $er->getQuery()->getResult();
		if($tasks) {
			foreach($tasks as $task) {
				$response[] = array('id' => $task->getId(), 'title' => $task->getTitle(), 'note' => $task->getNote(), 'completed' => $task->getCompleted(), 'deleted' => $task->getDeleted());
			}
			$response['count'] = count($tasks);
		}
		return new JsonResponse($response, 200);
	}
	
	public function ajaxViewAction(Request $request) {
		
        if (!$request->isXmlHttpRequest()) {
            throw new NotFoundHttpException();
        }
		
		$id = $request->request->get('id');
		$response = array('status' => 'failure', 'message' => 'Could not find Record');
		if(is_numeric($id)) {
			$er = $this->getDoctrine()->getManager()->getRepository('AppBundle:Task')
					   ->createQueryBuilder('t')
					   ->where('t.id = :taskId')
					   ->setParameter('taskId', $id)
					   ->andWhere('t.deleted = :deleted')
					   ->setParameter('deleted', false)
					   ->andWhere('t.clientIp = :clientIp')
					   ->setParameter('clientIp', $_SERVER['REMOTE_ADDR']);
					   
			$task = $er->getQuery()->getResult();
			if($task) {
				$response = array('status' => 'success', 'id' => $task[0]->getId(), 'title' => $task[0]->getTitle(), 'note' => $task[0]->getNote(), 'completed' => $task[0]->getCompleted(), 'deleted' => $task[0]->getDeleted());
				return new JsonResponse($response, 200);
			}
		}
		return new JsonResponse($response, 400);
	}

	public function ajaxCreateAction(Request $request) {
		
        if (!$request->isXmlHttpRequest()) {
            throw new NotFoundHttpException();
        }
		
		$title = $request->request->get('title');
		$response = array('status' => 'failure', 'message' => 'Could not find Record');
		if($title) {
			$response['message'] = "Please enter your Title";
			if($title) {
				$task = new Task();
				$task->setTitle($title);
				$er = $this->container->get('doctrine')->getEntityManager();
				$er->persist($task);
				$er->flush();	
				
				$response = array('status' => 'success');
				return new JsonResponse($response, 200);
			}
		}
		return new JsonResponse($response, 400);
	}
	
	public function ajaxUpdateAction(Request $request) {
		
        if (!$request->isXmlHttpRequest()) {
            throw new NotFoundHttpException();
        }
		
		$id = $request->request->get('id');
		$response = array('status' => 'failure', 'message' => 'Could not find Record');
		if(is_numeric($id)) {
			$title = $request->request->get('title');
			$note = $request->request->get('note', '');
			$response['message'] = "Please enter your Title";
			if($title) {
				$er = $this->getDoctrine()->getManager()->getRepository('AppBundle:Task')
						   ->createQueryBuilder('t')
						   ->update()
						   ->set('t.title', ':title')
						   ->setParameter('title', $title)
						   ->set('t.lastModified', ':lastModified')
						   ->setParameter('lastModified', new \DateTime())
						   ->where('t.id = :taskId')
						   ->setParameter('taskId', $id)
						   ->andWhere('t.deleted = :deleted')
						   ->setParameter('deleted', false)
						   ->andWhere('t.clientIp = :clientIp')
						   ->setParameter('clientIp', $_SERVER['REMOTE_ADDR']);
						   
				$task = $er->getQuery()->getResult();
				if($task) {
					$response = array('status' => 'success');
					return new JsonResponse($response, 200);
				}
			}
		}
		return new JsonResponse($response, 400);
	}
	
	public function ajaxRemoveAction(Request $request) {
		
        if (!$request->isXmlHttpRequest()) {
            throw new NotFoundHttpException();
        }
		
		$id = $request->request->get('id');
		$response = array('status' => 'failure', 'message' => 'Could not find Record');
		if(is_numeric($id)) {
			$er = $this->getDoctrine()->getManager()->getRepository('AppBundle:Task')
					   ->createQueryBuilder('t')
					   ->update()
					   ->set('t.deleted', ':deleted')
					   ->setParameter('deleted', true)
					   ->set('t.lastModified', ':lastModified')
					   ->setParameter('lastModified', new \DateTime())
					   ->where('t.id = :taskId')
					   ->setParameter('taskId', $id)
					   ->andWhere('t.clientIp = :clientIp')
					   ->setParameter('clientIp', $_SERVER['REMOTE_ADDR']);
					   
			$task = $er->getQuery()->getResult();
			if($task) {
				$response = array('status' => 'success');
				return new JsonResponse($response, 200);
			}
		}
		return new JsonResponse($response, 400);
	}

	public function ajaxRestoreAction(Request $request) {
		
        if (!$request->isXmlHttpRequest()) {
            throw new NotFoundHttpException();
        }
		
		$id = $request->request->get('id');
		$response = array('status' => 'failure', 'message' => 'Could not find Record');
		if(is_numeric($id)) {
			$er = $this->getDoctrine()->getManager()->getRepository('AppBundle:Task')
					   ->createQueryBuilder('t')
					   ->update()
					   ->set('t.deleted', ':deleted')
					   ->setParameter('deleted', false)
					   ->where('t.id = :taskId')
					   ->setParameter('taskId', $id)
					   ->andWhere('t.deleted = :deleted')
					   ->setParameter('deleted', true)
					   ->andWhere('t.clientIp = :clientIp')
					   ->setParameter('clientIp', $_SERVER['REMOTE_ADDR']);
					   
			$task = $er->getQuery()->getResult();
			if($task) {
				return ajaxViewAllAction($request);
			}
		}
		return new JsonResponse($response, 400);
	}
	
	public function ajaxActiveAction(Request $request) {
		
        if (!$request->isXmlHttpRequest()) {
            throw new NotFoundHttpException();
        }
		
		$id = $request->request->get('id');
		$response = array('status' => 'failure', 'message' => 'Could not find Record');
		if(is_numeric($id)) {
			$er = $this->getDoctrine()->getManager()->getRepository('AppBundle:Task')
					   ->createQueryBuilder('t')
					   ->update()
					   ->set('t.completed', ':completed')
					   ->setParameter('completed', false)
					   ->set('t.lastModified', ':lastModified')
					   ->setParameter('lastModified', new \DateTime())
					   ->where('t.id = :taskId')
					   ->setParameter('taskId', $id)
					   ->andWhere('t.deleted = :deleted')
					   ->setParameter('deleted', false)
					   ->andWhere('t.clientIp = :clientIp')
					   ->setParameter('clientIp', $_SERVER['REMOTE_ADDR']);
					   
			$task = $er->getQuery()->getResult();
			if($task) {
				$response = array('status' => 'success');
				return new JsonResponse($response, 200);
			}
		}
		return new JsonResponse($response, 400);
	}

	public function ajaxCompleteAction(Request $request) {
		
        if (!$request->isXmlHttpRequest()) {
            throw new NotFoundHttpException();
        }
		
		$id = $request->request->get('id');
		$response = array('status' => 'failure', 'message' => 'Could not find Record');
		if(is_numeric($id)) {
			$er = $this->getDoctrine()->getManager()->getRepository('AppBundle:Task')
					   ->createQueryBuilder('t')
					   ->update()
					   ->set('t.completed', ':completed')
					   ->setParameter('completed', true)
					   ->set('t.lastModified', ':lastModified')
					   ->setParameter('lastModified', new \DateTime())
					   ->where('t.id = :taskId')
					   ->setParameter('taskId', $id)
					   ->andWhere('t.deleted = :deleted')
					   ->setParameter('deleted', false)
					   ->andWhere('t.clientIp = :clientIp')
					   ->setParameter('clientIp', $_SERVER['REMOTE_ADDR']);
					   
			$task = $er->getQuery()->getResult();
			if($task) {
				$response = array('status' => 'success');
				return new JsonResponse($response, 200);
			}
		}
		return new JsonResponse($response, 400);
	}
	
}
